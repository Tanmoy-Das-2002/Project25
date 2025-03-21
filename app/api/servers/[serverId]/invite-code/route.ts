import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    console.log("🔹 Received PATCH request for server:", params.serverId);

    if (!params.serverId) {
      console.error("❌ Server ID Missing");
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const profile = await currentProfile();
    if (!profile) {
      console.error("❌ Unauthorized request - No profile found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("🔹 Checking if server exists with ID:", params.serverId);

    const server = await db.server.findUnique({
      where: { id: params.serverId },
    });

    if (!server) {
      console.error("❌ Server not found in database!");
      return new NextResponse("Server not found", { status: 404 });
    }

    console.log("🔹 Updating invite code for server:", params.serverId);

    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
        members: {
          some: { profileId: profile.id },
        },
      },
      data: { inviteCode: uuidv4() },
    });

    console.log("✅ Successfully updated invite code:", updatedServer.inviteCode);
    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
