export const PRODUCTS = {
  spinCycle: {
    id: "spin-cycle",
    name: "Spin Cycle",
    requiredMembership: "member",
    publicLabel: "Case Study",
    memberLabel: "Interactive Workflow",
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export type MembershipTier = "public" | "member";
