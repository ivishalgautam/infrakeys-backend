const { pool } = require("../config/db");

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
    const selectQuery = `
    SELECT
        vp.product_id,
        p.title AS product_title,
        p.about AS product_about,
        p.images AS product_images,
        sc.sub_category_name AS product_sub_category
    FROM
        viewed_products vp
    JOIN
        products p
    ON
        vp.product_id = p.id
    JOIN
        sub_categories sc
    ON
        p.sub_category_id = sc.id
    WHERE
        vp.user_id = $1
    ORDER BY
        vp.timestamp DESC
    LIMIT 5;
    `;

    const data = await pool.query(
      `
      SELECT
      vp.id AS view_id,
      u.fullname AS user_fullname,
      u.email AS user_email,
      p.title AS product_title,
      p.about AS product_about,
      p.images AS product_images,
      vp.timestamp AS view_timestamp
    FROM
        viewed_products vp
    JOIN
        users u
    ON
        vp.user_id = u.id
    JOIN
        products p
    ON
        vp.product_id = p.id
    JOIN
        sub_categories sc
    ON  
        p.sub_category_id = sc.id
    ORDER BY
        vp.timestamp DESC
    LIMIT 5;
    `,
      [userId]
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { viewProduct, recentlyViewed };
