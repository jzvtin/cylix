import { Text } from "@modules/common/components/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params

  return (
    <div className="mx-auto mb-20 mt-10 flex w-full max-w-[560px] flex-col items-start gap-y-4 px-[clamp(16px,4vw,32px)]">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <h1 className="cx-h text-[clamp(24px,4vw,32px)]">
          Transfer request for order {id}
        </h1>
        <Text className="text-ink/60">
          You&#39;ve received a request to transfer ownership of your order ({id}).
          If you agree to this request, you can approve the transfer by clicking
          the button below.
        </Text>
        <div className="h-px w-full bg-ink/[0.08]" />
        <Text className="text-ink/60">
          If you accept, the new owner will take over all responsibilities and
          permissions associated with this order.
        </Text>
        <Text className="text-ink/60">
          If you do not recognize this request or wish to retain ownership, no
          further action is required.
        </Text>
        <div className="h-px w-full bg-ink/[0.08]" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
