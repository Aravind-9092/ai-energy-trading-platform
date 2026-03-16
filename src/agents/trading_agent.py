import random

class EnergyTradingAgent:

    def __init__(self, price_per_kwh=0.30):
        self.price = price_per_kwh

    def decide(self, generation, demand):

        print("\nAI Trading Agent Decision")

        print("Generation:", generation, "kW")
        print("Demand:", demand, "kW")

        if generation > demand:

            surplus = generation - demand
            revenue = surplus * self.price

            print("\nDecision: SELL ENERGY")
            print("Energy Sold:", round(surplus,2), "kW")
            print("Revenue: AED", round(revenue,2))

        elif generation < demand:

            deficit = demand - generation
            cost = deficit * self.price

            print("\nDecision: BUY ENERGY")
            print("Energy Bought:", round(deficit,2), "kW")
            print("Cost: AED", round(cost,2))

        else:

            print("\nDecision: PERFECT BALANCE")


# Test agent
if __name__ == "__main__":

    agent = EnergyTradingAgent()

    generation = float(input("Enter power generation (kW): "))

    demand = random.randint(100,200)

    agent.decide(generation, demand)