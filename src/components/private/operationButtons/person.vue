<template>
    <div class="pane-item">
        <div v-if="!showForm">
            <Row class="m-row">
                <div class="title">人员</div>
                <Input class="condition" placeholder="请输入人员信息"/>
                <Button type="warning" class="search">查询</Button>
                <Button type="warning" title="添加人员" class="add" @click="handleShowForm">添加</Button>
            </Row>
            <Table :columns="columns" :data="data" width="400" style="margin: .5rem;"></Table>
        </div>
        <div v-if="showForm">
            <Form :model="formInline">
                <FormItem class="form-item" prop="user">
                    <div class="title">姓名</div>
                        <div class="content">
                            <Input class="form-item-input" type="text" v-model="formInline.user" placeholder="请输入姓名" />
                        </div>
                </FormItem>
                <FormItem class="form-item" prop="tel">
                    <div class="title">联系方式</div>
                        <div class="content">
                            <Input class="form-item-input" type="text" v-model="formInline.tel" placeholder="请输入联系方式" />
                        </div>
                </FormItem>
            </Form>
            <div style="text-align:center;margin: 1rem 0;">
                <Button type="warning" @click="handleFormSubmit">添加</Button>
                <Button type="warning" @click="handleGoBack" style="margin-left: 1rem;">返回</Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'person',
  props: {
      url: String,
  },
  data () {
    return {
        formInline: {
            user: '',
            tel: '',
        },
        showForm: false,
        columns: [
            { title: '序号', key: 'index' },
            { title: '姓名', key: 'name' }
        ],
        data: [
            { index: '1', name: '张三' },
            { index: '2', name: '李四' },
            { index: '3', name: '王五' },
        ]
    }
  },
  methods: {
    handleSearchPerson: function(e) { // 查询数据
      console.log(e);
    },
    handleShowForm: function() {
        this.showForm = true;
    },
    handleGoBack: function() {
        this.showForm = false;
    },
    handleFormSubmit: function() {

    }
  },
  created() {}
}
</script>

<style lang="less">
.form-item {
    margin: 1rem 0;
}
.form-item-input {
    width: 200px;
}
.m-row .title {
    width: 10%;
}
.m-row .condition {
    width: 30%;
    margin-left: 2%;
}
.m-row .search {
    margin-left: 2%;
}
.m-row .add {
    margin-left: 2%;
}
</style>
