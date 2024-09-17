-- CreateTable
CREATE TABLE "_SharedFiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SharedFiles_AB_unique" ON "_SharedFiles"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedFiles_B_index" ON "_SharedFiles"("B");

-- AddForeignKey
ALTER TABLE "_SharedFiles" ADD CONSTRAINT "_SharedFiles_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SharedFiles" ADD CONSTRAINT "_SharedFiles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
