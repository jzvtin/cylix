import { declineTransferRequest } from "@lib/data/orders"
import { Text } from "@modules/common/components/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params

  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="mx-auto mb-20 mt-10 flex w-full max-w-[560px] flex-col items-start gap-y-4 px-[clamp(16px,4vw,32px)]">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <h1 className="cx-h text-[clamp(24px,4vw,32px)]">
              Order transfer declined!
            </h1>
            <Text className="text-ink/60">
              Transfer of order {id} has been successfully declined.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-ink/60">
              There was an error declining the transfer. Please try again.
            </Text>
            {error && (
              <Text className="text-red-600">Error message: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
