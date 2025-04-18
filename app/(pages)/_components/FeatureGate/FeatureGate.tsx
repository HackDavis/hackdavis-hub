import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';

export default async function FeatureGate({
  featureId,
  unavailableView = null,
  children,
}: {
  featureId: string;
  unavailableView?: React.ReactNode;
  children: React.ReactNode;
}) {
  const res = await checkFeatureAvailability(featureId);
  if (!res.ok) return <>{unavailableView}</>;

  return <>{children}</>;
}
