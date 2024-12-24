const GET = async (req) => {
  const response = await fetch('https://nemoeuuycytnxxdtqnlg.functions.eu-central-1.nhost.run/v1/evaluate');
  const data = await response.json();
  return Response.json(data);
}

const POST = async (req) => {
  const requestData = await req.json();
  console.log('requestData is ', requestData);
  return Response.json({ message: 'requestData test' });
  
}

export { GET, POST };