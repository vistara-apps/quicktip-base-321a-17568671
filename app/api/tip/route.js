    export async function POST(request) {
      try {
        // For demo, no storage, just return success
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } catch (error) {
        console.error('Error processing tip:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
      }
    }
  