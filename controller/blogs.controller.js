const { pool } = require("../config/db");
const fs = require("fs");

async function create(req, res) {
  const { title, content, summary, tags, category } = req.body;
  if (!title)
    return res.status(400).json({ message: "Please put some title." });

  if (!content)
    return res.status(400).json({ message: "Please put some content." });

  if (!summary)
    return res.status(400).json({ message: "Please put some summary." });

  let image = `/assets/categories/products/${req.file.filename}`;

  try {
    const { rows } = await pool.query(
      `INSERT INTO blogs (title, image, content, summary, tags, category) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
      [title, image, content, summary, tags, category]
    );
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function update(req, res) {
  const blogId = parseInt(req.params.blogId);
  const { ...data } = req.body;

  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE blogs SET ${updateColumns} WHERE id = $${
        updateValues.length + 1
      } returning *`,
      [...updateValues, blogId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "blog not found!" });
    }

    res.send(rows[0]);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function updateBlogImage(req, res) {
  const blogId = parseInt(req.paramss.blogId);
  let image = `/assets/categories/products/${req.file.filename}`;

  try {
    const record = await pool.query(`SELECT * FROM blogs WHERE id = $1;`, [
      blogId,
    ]);

    if (record.rowCount === 0)
      return res.status(404).json({ message: "blog not found!" });

    const file =
      record.rows[0]?.image !== null && record.rows[0]?.image !== ""
        ? path.join(__dirname, "../", record.rows[0]?.image)
        : "";

    if (fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        if (err) {
          console.log(`error deleting file: ${file}`);
        } else {
          console.log("prev file deleted");
        }
      });
    }

    const { rows } = await pool.query(
      `UPDATE blogs SET image = $1 WHERE id = $2 returning *`,
      [image, blogId]
    );

    res.send(rows[0]);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function deleteBlogImage(req, res) {
  const blogId = parseInt(req.params.blogId);

  try {
    const record = await pool.query(`SELECT * FROM blogs WHERE id = $1;`, [
      blogId,
    ]);

    if (record.rowCount === 0)
      return res.status(404).json({ message: "blog not found!" });

    const file =
      record.rows[0]?.image !== null && record.rows[0]?.image !== ""
        ? path.join(__dirname, "../", record.rows[0]?.image)
        : "";

    if (fs.existsSync(file)) {
      fs.unlink(file, async (err) => {
        if (err) {
          console.log(`error deleting file: ${file}`);
          return res.status(400).json({ message: "error deleting image" });
        } else {
          await pool.query(
            `UPDATE blogs SET image = $1 WHERE id = $2 returning *`,
            [image, blogId]
          );
          console.log("image deleted");
          return res.json({ message: "image deleted" });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function getById(req, res) {
  const blogId = parseInt(req.params.blogId);

  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM blogs WHERE id = $1`,
      [blogId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "blog not found!" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function get(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM blogs;`);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

async function deleteById(req, res) {
  const blogId = parseInt(req.params.blogId);

  try {
    const { rowCount } = await pool.query(`DELETE FROM blogs WHERE id = $1`, [
      blogId,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "blog not found!" });
    }

    res.json({ message: "blog deleted" });
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
}

module.exports = {
  create,
  update,
  getById,
  get,
  deleteById,
  updateBlogImage,
  deleteBlogImage,
};
