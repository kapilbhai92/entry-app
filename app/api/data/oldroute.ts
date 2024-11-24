// import { NextResponse } from 'next/server';

// // In-memory data storage (for demo purposes)
// let dataStore: any[] = [];

// export async function GET() {
//   return NextResponse.json({ data: dataStore });
// }

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { name, value } = body;

//   if (!name || !value) {
//     return NextResponse.json({ error: 'Name and value are required!' }, { status: 400 });
//   }

//   const newData = { id: dataStore.length + 1, name, value };
//   dataStore.push(newData);

//   return NextResponse.json({ message: 'Data added successfully!', data: newData });
// }

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the data.json file
const dataFilePath = path.join(process.cwd(), 'data.json');

// Helper function to read data from JSON file
async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Helper function to write data to JSON file
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
  const { name, value } = body;

  if (!name || !value) {
    return NextResponse.json({ error: 'Name and value are required!' }, { status: 400 });
  }

  const newData = { id: Date.now(), name, value };
  const currentData = await readData();

  currentData.push(newData);
  await writeData(currentData);

  return NextResponse.json({ message: 'Data added successfully!', data: newData });
}
