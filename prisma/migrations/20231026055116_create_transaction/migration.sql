-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "from_wallet" TEXT,
    "to_wallet" TEXT,
    "amount_wei" DECIMAL(78,0) NOT NULL,
    "gas_wei" DECIMAL(78,0),
    "block_produced_at" TIMESTAMP(3),
    "tx_raw" JSONB,
    "user_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
