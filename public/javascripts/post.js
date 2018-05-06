
//将元素的name属性的数组名称移向下一个下表。 如tag[1] --> tag[2]
function nameNextArrayIndex(element) {
    let name = element.attr('name');
    let a = name.indexOf('[');
    let b = name.indexOf(']');
    console.log(a,b);
    let index = parseInt(name.substr(a+1, b-a-1));
    console.log(name.substr(a+1, b-a-1));

    index += 1;
    name = name.substr(0, a) + '[' + index + ']';
    element.attr('name', name);
}

//将select元素恢复默认
function resetSelection(select) {
    select.find("option:selected").removeAttr("selected");
    select.find("option[value=0]").attr("selected", "selected");
}

//增加一个标签
function addTag(tag_id, tag_name) {
    let $tag_selector = $(".tag_selector");
    console.log("Let's add tag");
    let tag = $('<span class="tag"><input type="hidden" name="' + $tag_selector.attr('name') + '" value ="' + tag_id + '"/>' + tag_name + '</span>');

    //tag.find('button').click(deleteTag);
    
    resetSelection($tag_selector);
    nameNextArrayIndex($tag_selector);
    $tag_selector.before(tag);
}

//删除标签 TODO:编写删除标签
function deleteTag() {
    console.log('delete tag');
    return false;
}


$(".tag_selector").change(function(){
    console.log("selection has changed");
    let tag_id = $(this).val();
    let tag_name = $(this).find("option:selected").text();
    addTag(tag_id, tag_name);
})

$("button.submit").click(function(){
    let values = $("#postForm").serializeArray();
    console.log(values);
    return false;
})