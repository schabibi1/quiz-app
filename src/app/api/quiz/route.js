import { NextResponse } from "next/server";

const GET = async () => {
  const response = await fetch('https://nemoeuuycytnxxdtqnlg.functions.eu-central-1.nhost.run/v1/evaluate');
  const data = await response.json();
  return NextResponse.json(data);
}

const POST = async (req) => {
  const requestData = await req.json();
  console.log('requestData is ', requestData);
  return NextResponse.json({ message: 'quiz test' });
  
}

export { GET, POST };