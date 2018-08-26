<template>
    <div>
        <!-- Breadcrumb -->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">Admin</a>
            </li>
            <li class="breadcrumb-item active">{{title}}</li>
            <!-- Breadcrumb Menu-->
            <li class="breadcrumb-menu d-md-down-none">
                <div class="btn-group" role="group" aria-label="Button group">

                </div>
            </li>
        </ol>
        <div class="container-fluid">
            <slot></slot>
        </div>
    </div>

</template>
<script>
export default {
    props:['title']
}
</script>

