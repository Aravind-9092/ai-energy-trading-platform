import random

print("Energy Trading Simulation\n")

# Predicted power from solar farm
generation = float(input("Enter predicted power generation (kW): "))

# Simulated electricity demand
demand = random.randint(100, 200)

print("\nElectricity Demand:", demand, "kW")
print("Energy Generation:", generation, "kW")

# Market price
price_per_kwh = 0.30

if generation > demand:
    
    surplus = generation - demand
    revenue = surplus * price_per_kwh
    
    print("\nStatus: SURPLUS ENERGY")
    print("Energy Sold:", round(surplus,2), "kW")
    print("Revenue Earned: AED", round(revenue,2))

elif generation < demand:
    
    deficit = demand - generation
    cost = deficit * price_per_kwh
    
    print("\nStatus: ENERGY DEFICIT")
    print("Energy Bought:", round(deficit,2), "kW")
    print("Cost: AED", round(cost,2))

else:
    
    print("\nPerfect balance. No trading required.")