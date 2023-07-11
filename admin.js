const express = require("express");
const router = express.Router();
const knex = require("./db"); // knexの設定を分離

// ***********管理者登録の処理***********
router.patch("/maar/admin_assign", async (req, res) => {
  console.log("管理者更新の PATCHリクエスト 受信");
  // console.log(req.body);

  // reqから更新する世帯リストを取得
  const householdList = req.body;
  // データをチェック
  // console.log("householdList : ", householdList);
  const patchRollFlag = async (id, roleFlag) => {
    return knex("householdList").update("roleFlag", roleFlag).where("id", id);
  };

  if (householdList) {
    for (let i = 0; i < householdList.length; i++) {
      await patchRollFlag(householdList[i].id, householdList[i].roleFlag);
    }

    res.status(200).send("登録完了");
  } else {
    // 正常に投稿できない時は、エラーを返す
    res
      .status(400)
      .send("管理者情報を更新できません。内容を確認してください。");
  }
});
// ***********************************

module.exports = router;
