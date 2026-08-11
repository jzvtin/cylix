import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createPromotionsWorkflow } from "@medusajs/medusa/core-flows";

/**
 * Creates the "CYLIX" promotion: 10% off the whole order.
 *
 * Idempotent — if a promotion with code CYLIX already exists it does nothing,
 * so it's safe to run against production more than once.
 *
 * Run:  npx medusa exec ./src/scripts/create-cylix-promo.ts
 */
export default async function create_cylix_promo({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const CODE = "CYLIX";

  const { data: existing } = await query.graph({
    entity: "promotion",
    fields: ["id", "code"],
    filters: { code: CODE },
  });

  if (existing.length) {
    logger.info(`Promotion "${CODE}" already exists (${existing[0].id}) — nothing to do.`);
    return;
  }

  const { result } = await createPromotionsWorkflow(container).run({
    input: {
      promotionsData: [
        {
          code: CODE,
          type: "standard",
          status: "active",
          is_automatic: false,
          application_method: {
            type: "percentage",
            value: 10,
            target_type: "order",
            allocation: "across",
          },
        },
      ],
    },
  });

  logger.info(`Created promotion "${CODE}" (${result[0].id}) — 10% off the order, active.`);
}
