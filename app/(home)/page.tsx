import HomeBanner from "./_components/HomeBanner";
import Lite from "@/components/Features/Lite";
import Pro from "@/components/Features/Pro";

export default function Page() {

    return <div className="container mx-auto mt-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 lg:gap-4 gap-y-4">
            <HomeBanner />
            <Lite />
            <Pro />
        </div>
    </div>
}