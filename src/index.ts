import { PrismaClient } from "@prisma/client";
import express from "express";
import { compareSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post(`/signup`, async (req, res) => {
  const { email, password } = req.body;

  prisma.user
    .create({
      data: {
        email: email,
        password: hashSync(password, 8),
      },
    })
    .then((r) =>
      res.json({
        id: r.id,
        email: r.email,
        message: "User registered successfully!",
      })
    )
    .catch((reason) => res.status(500).send(reason));
});

app.get("/signin", async (req, res) => {
  try {
    let findFirst = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!findFirst) {
      res.status(404).send({ message: "User Not found." });
    }
    if (findFirst) {
      let passwordIsValid = compareSync(req.body.password, findFirst.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = sign({ id: findFirst.id }, "secret", {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: findFirst.id,
        email: findFirst.email,
        accessToken: token,
      });
    }
  } catch (e: any) {
    res.send(e.message);
  }
});

app.use((req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  if (token) {
    verify(token as string, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      (req as any).userId = (decoded as any).id;
      next();
    });
  }
});

app.post("/company", (req, res) => {
  const { name, address, ceo, date } = req.body;

  prisma.company
    .create({
      data: {
        address: address,
        ceo: ceo,
        name: name,
      },
    })
    .then((value) => {
      res.json(value);
    })
    .catch((reason) => {
      res.send(reason.message);
    });
});

app.post("/team", (req, res) => {
  const { leadName, companyID } = req.body;

  prisma.team
    .create({
      data: {
        LeadName: leadName,
        CompanyID: companyID,
      },
    })
    .then((value) => {
      res.json(value);
    })
    .catch((reason) => res.send(reason.message));
});

app.get("/company", (req, res) => {
  const { name } = req.query;
  console.log(name);

  prisma.company
    .findMany({
      where: {
        name: name as string,
      },
    })
    .then((r) => {
      res.json(r);
    })
    .catch((reason) => {
      console.log(reason);

      res.send(reason.message);
    });
});

app.get("/company/:id", (req, res) => {
  const id = req.params.id;

  prisma.company
    .findFirst({
      where: {
        id: id,
      },
    })
    .then((value) => {
      res.json(value);
    })
    .catch((reason) => res.send(reason.message));
});

app.get("/teams", (req, res) => {
  prisma.team.findMany({});
  prisma.company
    .findMany({
      include: {
        Team: true,
      },
    })
    .then((r) => {
      res.json(r);
    })
    .catch((reason) => {
      res.send(reason.message);
    });
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
