// require("jquery");
require("expose-loader?jquery-weui!../../../js/jquery-weui.min") ;

import { formatNum } from "../../../js/utils"

$("body").html('jquery success')

$.toast("操作成功");
console.log(formatNum(666))