import { Progress } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Progress.Root maxW="100%" value={null}  >
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
export default Loading