using System;
using System.Collections.Generic;

namespace MyConsoleApp
{
    public class SalesRecord
    {
        public string ProductCategory { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var salesRecords = new List<SalesRecord>
            {
                new SalesRecord { ProductCategory = "Electronics", Revenue = 1200.50m },
                new SalesRecord { ProductCategory = "Books", Revenue = 240.00m },
                new SalesRecord { ProductCategory = "Electronics", Revenue = 349.99m },
                new SalesRecord { ProductCategory = "Books", Revenue = 85.75m },
                new SalesRecord { ProductCategory = "Home", Revenue = 499.00m }
            };

            var revenueByCategory = CalculateTotalRevenueByCategory(salesRecords);

            foreach (var categoryRevenue in revenueByCategory)
            {
                Console.WriteLine($"{categoryRevenue.Key}: {categoryRevenue.Value:C}");
            }
        }

        public static Dictionary<string, decimal> CalculateTotalRevenueByCategory(IEnumerable<SalesRecord> salesRecords)
        {
            var totals = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);

            foreach (var record in salesRecords)
            {
                if (record == null || string.IsNullOrWhiteSpace(record.ProductCategory))
                {
                    continue;
                }

                if (totals.ContainsKey(record.ProductCategory))
                {
                    totals[record.ProductCategory] += record.Revenue;
                }
                else
                {
                    totals[record.ProductCategory] = record.Revenue;
                }
            }

            return totals;
        }
    }
}