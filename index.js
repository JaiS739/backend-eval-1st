const fs = require("fs");
const express = require("express");
const cors = require("cors");

const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  const result = fs.readFileSync("./products.json", "utf-8");
  console.log(result);
  res.send(result);
});

const router = express.Router();

app.post("/products/create", (req, res) => {
  const client_product = req.body;

  fs.readFile("./products.json", (err, data) => {
    if (err) {
      return err;
    }

    const parsed_products = JSON.parse(data);
    const products = parsed_products.products;
    products.push(client_product);

    const updated_products = fs.writeFileSync(
      "./products.json",
      JSON.stringify(parsed_products),
      "utf-8"
    );
    console.log(parsed_products);
    res.send(parsed_products);
  });
});

app.put("/products/:productId", (req, res) => {
  const id = req.params.productId;
  const edit_data = req.body;

  fs.readFile("./products.json", "utf-8", (err, data) => {
    if (err) {
      return err;
    }
    const parsed_products = JSON.parse(data);
    const updated_products = parsed_products.products.map((ele) => {
      if (ele.productId == id) {
        return { ...ele, product: edit_data.product };
      }
      return ele;
    });

    parsed_products.products = updated_products;

    const final_products = fs.writeFileSync(
      "./products.json",
      JSON.stringify(parsed_products),
      "utf-8"
    );
    res.send("updated");
  });
});

app.delete("/products/:productId", (req, res) => {
  const id = Number(req.params.productId);

  fs.readFile("./products.json", (err, data) => {
    if (err) {
      return err;
    }
    const parsed_data = JSON.parse(data);
    const products = parsed_data.products.filter((ele) => ele.productId !== id);
    console.log(products);

    parsed_data.products = products;

    fs.writeFileSync("./products.json", JSON.stringify(parsed_data), "utf-8");

    res.send("data deleted");
  });
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
