"use client";

import { useEffect, useState } from "react";
import { CustomComboBox } from "./combo-box";
import { CustomInput } from "./input-cus";
import { StartDotheTestCompo } from "./StartDoTheTest";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { setIsGenAI, setIsValid } from "@/lib/store/slice/ai_gen_slice";
import Loading from "react-loading";
import { cn } from "@/lib/utils";
import {
  AnsweredQuestion,
  setDataQuestion,
  setTimeAIQues,
} from "@/lib/store/slice/test_ai_slice";
import { useSession } from "next-auth/react";

type APIResponse = {
  data: AnsweredQuestion[];
};

export const AISecondSection = () => {
  const { data: session } = useSession();
  const subjects: string[] = [
    "Software Engineer",
    "Technology and Innovation",
    "Environmental Conservation",
    "Cultural Heritage",
    "Travel and Tourism",
    "Space Exploration",
    "Health and Wellness",
    "Global Economy",
    "Education Systems Worldwide",
    "Sports and Fitness",
    "Music and Arts",
  ];
  const min: string[] = ["15 phút", "20 phút", "30 phút"];
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { isGenAI, minute, subject, questions, isValid } = useAppSelector(
    (state) => state.aiQuesSlice,
  );
  const baseUrl = process.env.BASE_URL;
  let finalMin = "";
  useEffect(() => {
    if (isGenAI) {
      dispatch(setIsGenAI({ isGenAI: false }));
    }
    if (!isValid) {
      dispatch(setIsValid({ isValid: true }));
    }
  }, []);
  async function handleGenAI() {
    if (minute == "" || subject == "" || questions == "") {
      dispatch(setIsValid({ isValid: false }));
    } else {
      const sub = subject.replace(" ", "%");
      setIsLoading(true);
      const response = await fetch(
        `${baseUrl}/api/v1/aiquestion?questions=${questions}&subject=${sub}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );
      setIsLoading(false);
      if (response.ok) {
        const res: APIResponse = await response.json();
        const dataQuestions: AnsweredQuestion[] = res.data;
        dispatch(setDataQuestion({ dataQuestions }));
        finalMin =
          minute == "15 phút"
            ? "15:00"
            : minute == "20 phút"
              ? "20:00"
              : "30:00";
        dispatch(setTimeAIQues({ time: finalMin }));
      } else {
        dispatch(setIsGenAI({ isGenAI: false }));
        return;
      }
      dispatch(setIsValid({ isValid: true }));
      dispatch(setIsGenAI({ isGenAI: true }));
    }
  }

  return (
    <section className="flex h-screen flex-col items-center bg-white">
      <div className="mt-5 flex gap-9">
        <div className="flex items-center justify-center gap-6 rounded-md bg-white p-10 shadow-cus">
          <svg
            width="60"
            height="63"
            viewBox="0 0 106 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M79.25 14H30.6667C29.4954 14.0003 28.3722 14.4789 27.5441 15.3307L14.2941 28.9557L14.0423 29.2373C13.4134 30.003 13.0485 30.9611 13.0044 31.9623L13 32.203V82.125C13 89.6369 18.9448 95.75 26.25 95.75H66C68.7389 95.7439 71.4092 94.8681 73.6457 93.2422C75.8822 91.6164 77.5757 89.3198 78.4948 86.6667H81.4583C87.6505 86.6667 92.5 80.6853 92.5 73.0417V27.625C92.5 20.1131 86.5552 14 79.25 14ZM26.25 86.6667C23.8164 86.6667 21.8333 84.632 21.8333 82.125V36.7083H30.6667V86.6667H26.25ZM70.4167 82.125C70.4167 84.632 68.4336 86.6667 66 86.6667H35.0833V36.7083H66C68.4336 36.7083 70.4167 38.743 70.4167 41.25V82.125ZM83.6667 73.0417C83.6667 75.8575 82.2357 77.5833 81.4583 77.5833H79.25V41.25C79.25 33.7381 73.3052 27.625 66 27.625H28.0785L32.4952 23.0833H79.25C81.6836 23.0833 83.6667 25.118 83.6667 27.625V73.0417Z"
              fill="#EDA21F"
            />
          </svg>
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-[18px] font-bold">Chủ đề</p>
            <CustomComboBox data={subjects} type={"sub"} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 rounded-md bg-white p-10 shadow-cus">
          <svg
            width="50"
            height="53"
            viewBox="0 0 92 103"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M61.3372 0H30.6686V9.80952H61.3372V0ZM40.8915 63.7619H51.1143V34.3333H40.8915V63.7619ZM81.9363 31.3414L89.1945 24.3767C86.9966 21.8752 84.5942 19.521 81.9874 17.461L74.7292 24.4257C66.5887 18.1387 56.4525 14.712 46.0029 14.7143C20.5991 14.7143 0 34.4805 0 58.8571C0 83.2338 20.548 103 46.0029 103C54.6632 103.004 63.1488 100.662 70.4822 96.241C77.8156 91.8205 83.6987 85.5022 87.4537 78.0138C91.2088 70.5255 92.6832 62.1716 91.707 53.9144C90.7309 45.6572 87.3439 37.8324 81.9363 31.3414ZM46.0029 93.1905C26.2217 93.1905 10.2229 77.8386 10.2229 58.8571C10.2229 39.8757 26.2217 24.5238 46.0029 24.5238C65.7841 24.5238 81.7829 39.8757 81.7829 58.8571C81.7829 77.8386 65.7841 93.1905 46.0029 93.1905Z"
              fill="#FF5B5B"
            />
          </svg>

          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-[18px] font-bold">Thời gian</p>
            <CustomComboBox data={min} type={"min"} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 rounded-md bg-white p-10 shadow-cus">
          <svg
            width="41"
            height="40"
            viewBox="0 0 81 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M40.2853 0H46.1512C46.9006 0 47.6192 0.294019 48.1491 0.817377C48.679 1.34073 48.9767 2.05056 48.9767 2.7907C48.9767 3.53084 48.679 4.24066 48.1491 4.76402C47.6192 5.28738 46.9006 5.5814 46.1512 5.5814H40.5C31.541 5.5814 25.1062 5.58884 20.2086 6.23628C15.39 6.87628 12.4853 8.09674 10.3379 10.214C8.19419 12.3349 6.96223 15.2 6.31423 19.9591C5.6587 24.7963 5.65116 31.1516 5.65116 40C5.65116 48.8484 5.6587 55.2037 6.31423 60.0409C6.96223 64.8 8.19795 67.6688 10.3416 69.7898C12.4891 71.907 15.39 73.1237 20.2086 73.7637C25.1062 74.4112 31.541 74.4186 40.5 74.4186C49.459 74.4186 55.8938 74.4112 60.7914 73.7637C65.61 73.1237 68.5147 71.9033 70.6621 69.786C72.8058 67.6651 74.0378 64.8 74.6858 60.0409C75.3413 55.2037 75.3488 48.8484 75.3488 40V34.4186C75.3488 33.6785 75.6465 32.9686 76.1764 32.4453C76.7063 31.9219 77.425 31.6279 78.1744 31.6279C78.9238 31.6279 79.6425 31.9219 80.1724 32.4453C80.7023 32.9686 81 33.6785 81 34.4186V40.2121C81 48.8037 81 55.5349 80.2842 60.7888C79.5533 66.1619 78.0237 70.4037 74.6556 73.734C71.2838 77.0642 66.9889 78.5712 61.5449 79.293C56.2291 80 49.4138 80 40.7147 80H40.2853C31.5862 80 24.7709 80 19.4513 79.293C14.0111 78.5712 9.71623 77.0605 6.34437 73.734C2.97251 70.4037 1.4467 66.1619 0.715814 60.7851C2.24557e-07 55.5349 0 48.8037 0 40.2121V39.7879C0 31.1963 2.24557e-07 24.4651 0.715814 19.2112C1.4467 13.8381 2.97628 9.59628 6.34437 6.26605C9.71623 2.93581 14.0111 1.42884 19.4551 0.706977C24.7709 2.21785e-07 31.5862 0 40.2853 0ZM58.4707 3.81767C60.957 1.42976 64.295 0.104362 67.7629 0.128106C71.2308 0.151849 74.5499 1.52283 77.0024 3.94456C79.4549 6.36628 80.8437 9.64412 80.8684 13.0692C80.8932 16.4943 79.5519 19.7914 77.1346 22.2474L52.0886 46.9879C50.6909 48.3647 49.8131 49.2354 48.8373 49.987C47.6857 50.8757 46.4387 51.6368 45.1189 52.2567C44 52.7814 42.8207 53.1684 40.9483 53.786L30.0039 57.3879C29.0137 57.7136 27.9513 57.7606 26.9356 57.5237C25.9199 57.2867 24.9911 56.7752 24.2531 56.0463C23.5152 55.3175 22.9972 54.4001 22.7573 53.3969C22.5174 52.3938 22.565 51.3445 22.8947 50.3665L26.5416 39.5572C27.167 37.7042 27.5588 36.5433 28.09 35.4381C28.723 34.1333 29.489 32.9091 30.3882 31.7656C31.1492 30.7981 32.027 29.9349 33.4247 28.5544L58.4707 3.81767ZM73.1373 7.76186C71.7223 6.36491 69.8034 5.58017 67.8027 5.58017C65.8019 5.58017 63.883 6.36491 62.4679 7.76186L61.0514 9.16465C61.1318 9.52434 61.2548 9.94357 61.4206 10.4223C61.9593 11.9591 62.9841 13.9833 64.913 15.8884C66.7914 17.7442 69.1441 19.0623 71.7208 19.7023L73.1373 18.3033C74.5518 16.9056 75.3463 15.0105 75.3463 13.0344C75.3463 11.0584 74.5518 9.15947 73.1373 7.76186ZM67.2677 24.1042C64.8955 23.094 62.7397 21.6468 60.9158 19.84C59.0864 18.0385 57.6211 15.9094 56.5983 13.5665L37.5539 32.3721C35.9828 33.9237 35.3687 34.5377 34.8413 35.2C34.2008 36.0216 33.649 36.907 33.1949 37.8419C32.8257 38.5972 32.5469 39.4158 31.8424 41.4958L30.2187 46.3144L34.1067 50.1581L38.9855 48.5507C41.0953 47.8549 41.9203 47.5795 42.6889 47.2186C43.6383 46.7721 44.5299 46.2276 45.3638 45.5851C46.0306 45.0679 46.6522 44.4614 48.2233 42.9135L67.2677 24.1042Z"
              fill="#45B2CE"
            />
          </svg>

          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-[18px] font-bold">Số lượng câu hỏi</p>
            <CustomInput />
          </div>
        </div>
      </div>
      <hr className="border-1 my-7 w-[40%] border-[#AAAA]" />
      <button
        className={cn(
          "rounded-[10px] px-[95px] py-2 text-[17px] font-bold text-white shadow-cus",
          isLoading || isGenAI ? "cursor-default bg-[#B5C3C3]" : "bg-[#97D2D3]",
        )}
        disabled={isGenAI || isLoading}
        onClick={handleGenAI}
      >
        {isGenAI ? (
          "Đã tạo câu hỏi"
        ) : isLoading ? (
          <Loading type="spin" width={"25px"} height={"25px"} />
        ) : (
          "Bắt đầu tạo câu hỏi"
        )}
      </button>
      <StartDotheTestCompo />
    </section>
  );
};
