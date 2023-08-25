async function viewProduct(req, res) {
  try {
    const { userId, productId } = req.body;
    const timestamp = new Date();

    // Insert the view into the database
    const insertQuery =
      "INSERT INTO viewed_products (user_id, product_id, timestamp) VALUES ($1, $2, $3)";
    const values = [userId, productId, timestamp];

    // Execute the SQL query to insert the view
    pool.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting view:", err);
        res.status(500).json({ message: "Error inserting view" });
      } else {
        res.status(200).json({ message: "View recorded successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function recentlyViewed(req, res) {
  try {
    const userId = req.params.userId;

    // Query the database to retrieve recently viewed products
    const selectQuery =
      "SELECT product_id, timestamp FROM viewed_products WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 5";

    pool.query(selectQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error retrieving recently viewed products:", err);
        res
          .status(500)
          .json({ error: "Error retrieving recently viewed products" });
      } else {
        const recentlyViewedProducts = result.rows;
        res.status(200).json({ recentlyViewedProducts });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { viewProduct, recentlyViewed };
