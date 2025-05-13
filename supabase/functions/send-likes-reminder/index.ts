import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 공연 시작 날짜 포맷 변환
function formatDateTransform(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function getKstTomorrowDate(): Date {
  const nowUtc = new Date();
  const kstTime = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
  // 한국시간 변환
  kstTime.setDate(kstTime.getDate() + 1);
  return kstTime;
}

serve(async (req) => {
  try {
    console.log("Edge Function 실행 시작");

    // 일반 쿼리용 클라이언트
    const supabase = createClient(
      Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!,
      Deno.env.get("EXPO_PUBLIC_SUPABASE_KEY")!
    );

    // 관리자 클라이언트 (RLS 우회용)
    const adminClient = createClient(
      Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!,
      Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // 내일 날짜 계산
    const targetDate = getKstTomorrowDate();
    const formattedDate = formatDateTransform(targetDate);
    console.log(`📆 내일 날짜 (KST 기준): ${formattedDate}`);

    // likes 테이블에서 해당 날짜에 좋아요한 유저 조회 (token 비교)
    const { data: likes, error: likesError } = await supabase
      .from("likes")
      .select("profile_id, performance_name")
      .eq("performance_prfpdfrom", formattedDate);

    if (likesError) {
      console.error("공연 데이터 조회 실패:", likesError.message);
      return new Response("공연 데이터 조회 실패", { status: 500 });
    }

    if (!likes || likes.length === 0) {
      console.log("해당 날짜에 좋아요한 공연이 없습니다.");
      return new Response("해당 날짜에 알림 대상이 없습니다.", { status: 200 });
    }

    // unique profile_id 대상 추출
    const users = Array.from(new Set(likes.map((like) => like.profile_id)));
    console.log(`알림 대상 유저 수: ${users.length}`);

    let successCount = 0;
    let failCount = 0;

    for (const profileId of users) {
      console.log(`유저 profile_id=${profileId} 처리 중`);

      // profile_id 해당 fcm_token 조회
      const { data: tokenData, error: tokenError } = await supabase
        .from("fcm_tokens")
        .select("fcm_token")
        .eq("profile_id", profileId);

      // START 토큰 존재 debugging
      if (tokenError) {
        console.warn(`토큰 조회 실패: ${tokenError.message}`);
        failCount++;
        continue;
      }

      if (!tokenData || tokenData.length === 0) {
        console.warn(`토큰 없음: profile_id=${profileId}`);
        failCount++;
        continue;
      }
      // END 토큰 존재 debugging

      const tokens = tokenData.map((t) => t.fcm_token);
      console.log(`토큰 ${tokens.length}개 조회 완료`);

      // 좋아요 공연명 수집
      const performances = likes
        .filter((like) => like.profile_id === profileId)
        .map((like) => like.performance_name)
        .join(", ");

      const message = {
        to: tokens,
        sound: "default",
        title: "좋아요한 공연이 곧 시작돼요!",
        body: `${performances} 공연이 내일 시작됩니다. 놓치지 마세요!`,
        data: { type: "performance_reminder" },
      };

      // 관리자 클라이언트로 notifications 테이블에 데이터 삽입
      const { data: notifData, error: notifError } = await adminClient
        .from("notifications")
        .insert([
          {
            user_id: profileId,
            title: "좋아요한 공연이 곧 시작돼요!",
            body: `${performances} 공연이 내일 시작됩니다. 놓치지 마세요!`,
            read: false,
          },
        ]);

      if (notifError) {
        console.error(
          `알림 데이터 저장 실패 for ${profileId}:`,
          notifError.message
        );
        failCount++;
      } else {
        console.log(`알림 데이터 저장 성공 for ${profileId}`);
        successCount++;
      }

      // 푸시 알림 전송 단계
      const expoRes = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!expoRes.ok) {
        const errorText = await expoRes.text();
        console.error(`푸시 실패 for ${profileId}:`, errorText);
      } else {
        console.log(`푸시 성공 for ${profileId}`);
      }
    }

    console.log(
      `Edge Function 실행 완료: 성공 ${successCount}개, 실패 ${failCount}개`
    );
    return new Response(
      `알림 전송 완료: 성공 ${successCount}개, 실패 ${failCount}개`,
      { status: 200 }
    );
  } catch (error) {
    console.error("전체 실행 중 오류 발생:", error.message);
    return new Response(`오류 발생: ${error.message}`, { status: 500 });
  }
});
