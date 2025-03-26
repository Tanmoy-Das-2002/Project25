import { ServerSidebar } from "@/components/server/server-sidebar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // Ensure params is awaited before using it
  const { serverId } = await Promise.resolve(params);

  if (!serverId) {
    console.error("❌ Missing serverId in URL params.");
    return redirect("/");
  }

  const profile = await currentProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    console.error(`❌ Server not found or user is not a member. ServerId: ${serverId}`);
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-10 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="md:pl-60 h-full">{children}</main>
    </div>
  );
};

export default ServerIdLayout;


// This was the code i chatgpted and pasted it for now its working in case of any issue revert this back
// import { ServerSidebar } from "@/components/server/server-sidebar";
// import { RedirectToSignIn } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";

// const ServerIdLayout = async ({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { serverId: string };
// }) => {
  

//   const profile = await currentProfile();

//   if (!profile) {
//     return <RedirectToSignIn />;
//   }

//   const server = await db.server.findUnique({
//     where: {
//       id: params.serverId,
//       members: {
//         some: {
//           profileId: profile.id,
//         },
//       },
//     },
//   });

//   if (!server) {
//     return redirect("/");
//   }

//   return (
//     <div className="h-full">
//       <div className="hidden md:flex h-full w-60 z-10 flex-col fixed inset-y-0">
//         <ServerSidebar serverId={params.serverId} />
//       </div>
//       <main className="md:pl-60 h-full">{children}</main>
//     </div>
//   );
// };

// export default ServerIdLayout;
