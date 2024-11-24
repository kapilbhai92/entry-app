import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the data.json file
const dataFilePath = path.join(process.cwd(), 'data.json');

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Helper function to write data
async function writeData(data: any[]) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

export async function GET() {
  const data = await readData();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, receiver, hoFee, ownerFee, receiverMobile, depositor, depositorMobile } = body;

  if (!amount || !receiver || !hoFee || !ownerFee || !receiverMobile || !depositor || !depositorMobile) {
    return NextResponse.json({ error: 'All fields are required!' }, { status: 400 });
  }

  const newData = {
    id: Date.now(),
    amount,
    receiver,
    hoFee,
    ownerFee,
    receiverMobile,
    depositor,
    depositorMobile,
  };

  const currentData = await readData();
  currentData.push(newData);
  await writeData(currentData);

  return NextResponse.json({ message: 'Data added successfully!', data: newData });
}
