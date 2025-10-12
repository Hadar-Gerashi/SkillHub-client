import { EmptyState, For, Stack, VStack } from "@chakra-ui/react"
import { LuShoppingCart } from "react-icons/lu"

const EmptyCart = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
      <Stack >
        <For each={["lg"]}>
          {(size) => (
            <EmptyState.Root size={size} key={size}>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <LuShoppingCart />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>Your cart is empty</EmptyState.Title>
                  <EmptyState.Description>
                    Explore our courses and add items to your cart
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
        </For>
      </Stack></div>
  )
}

export default EmptyCart
