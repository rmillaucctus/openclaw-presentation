import { NextResponse } from "next/server"
import { deleteSubmission } from "@/lib/kv"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await deleteSubmission(id)
  return NextResponse.json({ ok: true })
}
