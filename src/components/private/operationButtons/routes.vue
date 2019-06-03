<template>
    <div class="pane-item">
        <div v-if="!showForm">
            <Row class="m-row">
                <div class="title">路线</div>
                <Input class="condition" placeholder="请输入路线信息"/>
                <Button type="warning" class="search">查询</Button>
                <Button type="warning" title="添加路线" class="add" @click="handleShowForm">添加</Button>
            </Row>
            <Table :columns="columns" :data="data" width="400" style="margin: .5rem;"></Table>
        </div>
        <div v-if="showForm">
            <Form :model="formInline">
                <FormItem class="form-item" prop="user">
                    <div class="title">路线</div>
                        <div class="content">
                            <Input class="form-item-input" type="text" v-model="formInline.user" placeholder="请输入路线" />
                        </div>
                </FormItem>
                <FormItem class="form-item" prop="tel">
                    <div class="title">路线详情</div>
                        <div class="content">
                            <Input class="form-item-input" type="text" v-model="formInline.tel" placeholder="请输入路线详情" />
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
  name: 'routes',
  props: {
      url: String,
  },
  data () {
    return {
        formInline: {
            plan: '',
            detail: '',
        },
        showForm: false,
        columns: [
            { title: '序号', key: 'index' },
            { title: '详情', key: 'detail' }
        ],
        data: [
            { index: '1', detail: 'A' },
            { index: '2', detail: 'B' },
            { index: '3', detail: 'C' },
        ]
    }
  },
  methods: {
    handleShowForm: function() {
        this.showForm = true;
    },
    handleGoBack: function() {
        this.showForm = false;
    },
    handleFormSubmit: function() {

    },
    handleSearch: function() {

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
    width: 20%;
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
