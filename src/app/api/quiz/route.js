import { NextResponse } from "next/server";

const POST = async (req) => {
  const requestData = await req.json();
  console.log('requestData is: ', requestData);
  return NextResponse.json(requestData);
}

export { POST };