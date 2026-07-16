import { Skeleton } from "@mantine/core";

export function SkeletonBase({ visible }: { visible: boolean }) {
  const skeletonArray = new Array(20).fill(null);
  return (
    <>
      <Skeleton visible={visible} height={100} circle mb="xl" />

      {skeletonArray.map((_, index) => (
        <Skeleton
          visible={visible}
          key={index}
          mt={10}
          height={15}
          radius="xl"
        />
      ))}
      {/* <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" /> */}
    </>
  );
}
