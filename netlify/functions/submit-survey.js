export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false })
    };
  }

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(
      'https://api.github.com/repos/buthaynah141/colchester-saudi-club-survey/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'survey-submission',
          client_payload: payload
        })
      }
    );

    // If GitHub does not return 204, log the response text for debugging
    if (response.status !== 204) {
      const text = await response.text();
      console.error('GitHub dispatch failed:', response.status, text);
      throw new Error('GitHub dispatch failed');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
}
