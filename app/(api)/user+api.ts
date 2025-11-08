import { neon } from "@neondatabase/serverless";

// const posts = await sql("SELECT * FROM posts");

// See https://neon.com/docs/serverless/serverless-driver
// for more information

export async function POST(request: Request) {
  try {
    console.log(process.env.DATABASE_URL);
    const sql = neon(process.env.DATABASE_URL!);
    const { first_name, last_name, email, clerkId } = await request.json();

    if (!first_name || !last_name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const response = await sql`
  INSERT INTO users (first_name, last_name, email, clerk_id) VALUES (${first_name}, ${last_name}, ${email}, ${clerkId})
  `;
    return new Response(JSON.stringify({ response }), { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { first_name, last_name, clerkId } = await request.json();

    // Basic validation
    if (!first_name || !last_name || !clerkId) {
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
      WHERE clerk_id = ${clerkId}
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
