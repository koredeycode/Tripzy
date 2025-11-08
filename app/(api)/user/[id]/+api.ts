import { neon } from "@neondatabase/serverless";

export async function PUT(request: Request, { id }: { id: string }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { first_name, last_name } = await request.json();

    // Basic validation
    if (!first_name || !last_name) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user details
    const result = await sql`
      UPDATE users
      SET first_name = ${first_name},
          last_name = ${last_name}
      WHERE clerk_id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user: result[0] }, { status: 200 });
  } catch (error) {
    console.error("PUT /users error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
