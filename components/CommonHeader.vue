<template>
	<!-- begin #header -->
	<div id="header" class="header navbar navbar-default navbar-fixed-top" style="position: relative;">
		<!-- begin container -->
		<div>
			<!-- begin navbar-header -->
			<div class="navbar-header">
				<a href="/" class="navbar-brand">
					<span class="brand-logo-law"></span>
					<span class="brand-text">
						上海市<span class="text-theme">申汇</span>律师事务所
					</span>
				</a>
			</div>
			<!-- end navbar-header -->
			<!-- begin navbar-collapse -->
			<div class="collapse navbar-collapse" id="header-navbar">
				<ul class="nav navbar-nav navbar-right" style="margin-right: 0px;">
          <li><nuxt-link to="/">首页</nuxt-link></li>
					<li><nuxt-link to="/about">律所简介</nuxt-link></li>
					<li><nuxt-link to="/dynamic">律所动态</nuxt-link></li>
					<li><nuxt-link to="/scope">业务范畴</nuxt-link></li>
          <li><nuxt-link to="/attornys">律师简介</nuxt-link></li>
					<li><nuxt-link to="/cases">经典案例</nuxt-link></li>
					<li><nuxt-link to="/contact">联系我们</nuxt-link></li>
				</ul>
			</div>
			<!-- end navbar-collapse -->
		</div>
		<!-- end container -->
		<!-- begin #home -->
    <div id="home" class="home home-bg" style="height: 300px;">
        <!-- begin content-bg -->
        <!-- <div class="content-bg" >
            <img src="/header-bg.jpg" alt="Home" />
        </div> -->
        <!-- end content-bg -->
        <!-- begin container -->
        <!-- <div class="home-content" style="margin-top: -70px;">
            <h1>上海申汇律师事务所</h1>
            <h3>专注所以专业</h3>
            <p>
                告诉你的诉求，我们可以帮助你.<br />
                Fight for you.
            </p>
        </div> -->
        <!-- end container -->
    </div>
    <!-- end #home -->
	</div>
	<!-- end #header -->
</template>
<script>
export default {
	components: {
	}
};
</script>
<style scoped>
.home-bg {
  background-image: url(/static/header-house.jpg);
  background-repeat: no-repeat;
  /* background-position: 0px -100px; */
  background-size: cover;
  /* -moz-background-size: 100% 100%; */
}
</style>