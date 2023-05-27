let mongoose = require("mongoose");
let express = require("express");
let router = express.Router();
const { check, validationResult } = require("express-validator");

let Permission = require("../Models/Permission");
const { verifyToken } = require("../Helpers");

router.post(
  "/save",
  [
    check("role_id", "Role Id  is required").not().isEmpty(),
    check("checked_tabs", "Atleast check a single tab").not().isEmpty(),
  ],
  async (req, res) => {
    if (verifyToken(req, res)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }

      const role_id = req.body.role_id;
      const checked_tabs = req.body.checked_tabs;
      const checked_pers = req.body.checked_pers;
      const deleteAll = await Permission.deleteMany({role_id: {$in : role_id}});
      for (let i = 0; i < checked_tabs.length; i++) {
        // const element = array[i];
        const tab_link = checked_tabs[i];
        let can_create = 0;
        let can_update = 0;
        let can_delete = 0;
        if (checked_pers.includes(`${checked_tabs[i]}-add`)) {
          can_create = 1;
        }
        if (checked_pers.includes(`${checked_tabs[i]}-update`)) {
          can_update = 1;
        }
        if (checked_pers.includes(`${checked_tabs[i]}-delete`)) {
          can_delete = 1;
        }

        const request = {
          role_id,
          tab_link,
          can_create,
          can_update,
          can_delete,
        };
        Permission.create(request, (error, data) => {
          if (error) {
            return res.status(402).json({ error: error });
          } else {
            // return res.status(200).json(data);

          }
        });
      }
      return res.status(200).json(`data saved`);
    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
  }
);

router.get("/get-permissions/:role_id", (req, res) => {
  if (verifyToken(req, res)) {
    Permission.find(
      { $or: [{ role_id: req.params.role_id }] },
      (error, data) => {
        if (error) {
          return res.status(402).json({ error: error });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

module.exports = router;
