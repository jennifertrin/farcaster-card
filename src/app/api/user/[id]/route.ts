import { NextResponse } from 'next/server';
import { getSSLHubRpcClient, UserDataType, Message, MessagesResponse } from '@farcaster/hub-nodejs';

const hubRpcEndpoint = 'nemes.farcaster.xyz:2283'; // Using a public hub endpoint

async function getFarcasterUserData(fid: number) {
  const client = getSSLHubRpcClient(hubRpcEndpoint);
  
  try {
    // Wait for client to be ready
    await new Promise((resolve, reject) => {
      client.$.waitForReady(Date.now() + 5000, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve(true);
        }
      });
    });

    // Fetch user data
    const response = await client.getUserDataByFid({ 
      fid: fid,
    });

    if (!response.isOk() || !response.value?.messages?.length) {
      return {
        displayName: '',
        pfp: '',
        username: '',
        bio: '',
      };
    }

    // Extract relevant user data fields from messages
    const messages = response.value.messages;
    const userData = {
      displayName: messages.find(m => m.data?.userDataBody?.type === UserDataType.DISPLAY)?.data?.userDataBody?.value || '',
      pfp: messages.find(m => m.data?.userDataBody?.type === UserDataType.PFP)?.data?.userDataBody?.value || '',
      username: messages.find(m => m.data?.userDataBody?.type === UserDataType.USERNAME)?.data?.userDataBody?.value || '',
      bio: messages.find(m => m.data?.userDataBody?.type === UserDataType.BIO)?.data?.userDataBody?.value || '',
    };

    return userData;
  } catch (error) {
    console.error('Error fetching Farcaster user data:', error);
    throw error;
  } finally {
    // Always close the client connection
    client.close();
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fid = parseInt(params.id, 10);
    if (isNaN(fid)) {
      return NextResponse.json(
        { error: 'Invalid FID' },
        { status: 400 }
      );
    }

    // Fetch Farcaster user data
    const farcasterData = await getFarcasterUserData(fid);

    // Combine with our membership data
    const userData = {
      membershipId: params.id,
      profilePicture: farcasterData.pfp || `/api/user/${params.id}/avatar`,
      displayName: farcasterData.displayName || 'Farcaster User',
      username: farcasterData.username,
      bio: farcasterData.bio,
      membershipType: 'Pro',
      joinDate: new Date().toISOString(),
      isActive: true
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 