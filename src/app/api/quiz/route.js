export async function POST(req) {
  try {
    // Parse the incoming request body
    const { solutions } = await req.json();

    if (!solutions || !Array.isArray(solutions)) {
      console.log('solutions (Incoming req body): ', solutions);
      
      return new Response(
        JSON.stringify({ error: "Invalid input format. Expected 'solutions' array." }),
        { status: 400 }
      );
    }

    // Define the AWS Lambda endpoint URL (API Gateway URL)
    const endpoint = process.env.LAMBDA_EVALUATE_ENDPOINT;

    // Send the data to the AWS Lambda function via POST request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ solutions }),
    });

    if (!response.ok) {
      throw new Error('Failed to get a response from the Lambda function.');
    }

    // Parse the Lambda response
    const lambdaResponse = await response.json();
    console.log('lambdaResponse (Lambda res): ', lambdaResponse);

    // Return the response to the client
    return new Response(JSON.stringify(lambdaResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}