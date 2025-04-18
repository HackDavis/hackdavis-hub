import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';

export default async function FeatureGate({
  featureId,
  children,
}: {
  featureId: string;
  children: React.ReactNode;
}) {
  const res = await checkFeatureAvailability(featureId);
  if (!res.ok) return null;

  return <>{children}</>;
}
