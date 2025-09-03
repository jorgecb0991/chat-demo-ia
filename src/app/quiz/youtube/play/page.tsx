"use client";

import DefaultLayout from "@/components/layout/DefaultLayout"; // importa tu layout
import { BookOpenCheck } from "lucide-react";

export default function PlayYoutubeQuizPage(){

    return (<DefaultLayout
                title="Cuestionario"
                titleIcon={<BookOpenCheck className="w-6 h-6" />}
            >
                <div></div>
            </DefaultLayout>



    )


}