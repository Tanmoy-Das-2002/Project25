import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation"; // ✅ Use Next.js redirect

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");  // ✅ Correct way to redirect in a Server Function
    }

    const profile = await db.profile.findUnique({
        where: { userId: user.id }
    });

    if (profile) {
        return profile;
    }

    return await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });
};
