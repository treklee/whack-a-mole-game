$(function() {
	// 处理屏幕适配
	function autoRootFontSize() {
		document.documentElement.style.fontSize = Math.min(screen.width, document.documentElement.getBoundingClientRect().width) /
			750 * 32 + 'px';
	}
	window.addEventListener('resize', autoRootFontSize);
	autoRootFontSize();
})

// 给游戏限制一个运行的时间
var gemeTime = "30";
var s = 0;
var BtnOn;

// Track hits, misses, and total appearances for accuracy calculation
var totalHits = 0;
var correctHits = 0;
var wrongHits = 0;

// 随机函数
function rand(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

var secs = rand(700, 800); // Double the interval between appearances
var stay = rand(200, 400); // Make characters stay visible longer

// Calculate accuracy percentage
function calculateAccuracy() {
    if (totalHits === 0) return 0;
    return Math.round((correctHits / totalHits) * 100);
}

function timer(intDiff) {
    var timing = window.setInterval(function() {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0; //秒时间默认值        
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        
        $(".timeNum").text(second);
        intDiff--;
        
        // 判断当秒数为0的时候停止运行
        if (second == 00) {
            clearInterval(timing);
            clearInterval(circle);
            console.log(second + "秒，被停止");
            
            // Calculate final accuracy
            var finalAccuracy = calculateAccuracy();
            
            setTimeout(function() {
                // Make sure all game elements are properly hidden
                $(".GameBoxBg img").remove(); // Remove all game images
                
                // Show game over screen with proper z-index
                $(".gameOverBox").css({
                    "display": "block",
                    "z-index": "1000"
                });
                
                // Display accuracy instead of score
                $('#settlementNum').text(finalAccuracy + "%");
                
                // Hide other game elements
                $(".scoreBox").hide();
                $(".timeBox").hide();
                $(".ctBox").hide();
                $(".lolgBox").hide();
            }, 500);
        }        
    }, 1000);
}


// 背景音乐点击事件
$("#musicBtn").on("click", function() {
	if ($("#musicBtn").hasClass("musicS")) {
		$("#musicBtn").removeClass("musicS")
		// 暂停音乐
		$("#GameBGAudio")[0].pause();
	} else {
		$("#musicBtn").addClass("musicS");
		// 背景音乐播放
		$("#GameBGAudio")[0].play();
	}
});

// 开始游戏
$(".start").on("click", function() {
	$("#GameBGAudio")[0].play();
	$("#musicBtn").addClass("musicS");
	// 按钮移除开始框
	$(".startBox").hide();
	
	// Reset tracking variables
	totalHits = 0;
	correctHits = 0;
	wrongHits = 0;
	
	// 获取游戏执行倒计时
	timer(gemeTime);
	star(); // 第一次游戏的函数
});

// Fixed restart button function
$(".restart").on("click", function() {
    console.log("执行重新开始玩");
    // Properly hide game over screen
    $(".gameOverBox").hide();
    
    // Reset tracking variables
    totalHits = 0;
    correctHits = 0;
    wrongHits = 0;
    s = 0;
    
    // Reset displays
    $(".scoreNum").text("0");
    $("#settlementNum").text("0%");
    $(".timeNum").text("30");
    
    // Show game elements again
    $(".scoreBox").show();
    $(".timeBox").show();
    $(".ctBox").show();
    $(".lolgBox").show();
    
    // Remove any leftover game elements
    $(".GameBoxBg img").remove();
    
    // Start game again
    timer(gemeTime);
    star();
});

// 榜单按钮
$(".btn_ranking").on("click", function() {
	// 清空上一次内容
	$("#tbodyBox").html("");
	// 执行一次获取排行数据
})

// 游戏开始函数
function star() {
	var Htc = 0;
	var Xtc = 0;
	var audioNum = 0;
	var missedTargets = 0;
	
	//=============================================================================游戏进行时
	circle = setInterval(function() {
		//灰太狼随机出现的位置
		var arrPos = [{
				left: "2.25rem",
				top: "10.9375rem"
			},
			{
				left: "9.0625rem",
				top: "9.4375rem"
			},
			{
				left: "15.125rem",
				top: "11.625rem"
			},
			{
				left: "2.25rem",
				top: "17.75rem"
			},
			{
				left: "9.1875rem",
				top: "16.3125rem"
			},
			{
				left: "15.125rem",
				top: "18.5rem"
			},
			{
				left: "2.125rem",
				top: "27rem"
			},
			{
				left: "8.875rem",
				top: "25.4375rem"
			},
			{
				left: "15.125rem",
				top: "27.625rem"
			}
		];
		// 将图片存进数组
		// 灰太狼，
		var wolf_1 = ['image/h0.png', 'image/h1.png', 'image/h2.png', 'image/h3.png', 'image/h4.png', 'image/h5.png',
			'image/h6.png',
			'image/h7.png', 'image/h8.png', 'image/h9.png'
		];
		// 小灰狼
		var wolf_2 = ['image/x0.png', 'image/x1.png', 'image/x2.png', 'image/x3.png', 'image/x4.png', 'image/x5.png',
			'image/x6.png',
			'image/x7.png', 'image/x8.png', 'image/x9.png'
		];
		// 跳出动画
		var appearWolf = ['image/h0.png', 'image/x0.png'];
		// 创建一个img标签
		var newImg = document.createElement('img');
		// container盒子内添加img标签
		$(".GameBoxBg").append(newImg);
		// //  一共9个位置，狼的随机一个位置出现
		var wfLocation = rand(0, 8);
		// // 给新建的img标签添加左边距
		newImg.style.width = "6.75rem";
		// 防止js加载时，Img出现占位白边，此处属性设置Auto自适应
		newImg.style.height = "auto";
		newImg.style.left = arrPos[wfLocation].left;
		// 给新建的img标签添加顶部边距
		newImg.style.top = arrPos[wfLocation].top;

		// 给新建的img标签属性，设置为根据自己的位置定位
		newImg.style.position = 'absolute';
		// 选择灰太狼还是小灰灰
		var X = rand(0, 1);
		
		// Track if this target was clicked
		var wasClicked = false;
		
		// 当X<1的时候，选择正确
		if (X == 1) {
			Htc++;
			// 等于1时为正确
			X = 'h';
		} else {
			Xtc++;
			// 否则错误
			X = 'x';
		}
		var y = 0;
		// 图片设置为可见
		newImg.style.display = 'block';
		var appear0 = setInterval(function() {
			newImg.src = 'image/' + X + y + '.png';
			// 当前程序没执行一次，加一
			y++;
			// 设置鼠标单击次数判断条件
			var indexs = 0;
			// 当img被点击执行函数
			newImg.onclick = function() {
				// Mark as clicked
				wasClicked = true;
				
				// Increment total hits counter
				totalHits++;
				
				// 鼠标被点击条件加一
				indexs++;
				if (indexs > 1) {
					// 鼠标只能点击1次 而不能无限点
					return false;
				}
				// y等于第五帧动画图片
				y = 5;
				// 执行图片被点击的动画
				for (var i = 0; i < 4; i++) {
					y++;
					// 每执行一次赋值给当前被点击的标签做动效
					newImg.src = wolf_1[y];

					if (y > 9) {
						y--;
					}
				};
				// 当点击图片是正确
				if (X == 'h') {
					// Increment correct hits counter
					correctHits++;
					
					// 添加分数
					s += 10;
					// 将当前的数值赋值到HTML分数中显示
					$(".scoreNum").text(calculateAccuracy() + "%");
					// 播放一次音乐
					audioNum++;
					var audioS = '<audio class="second" id="secondAudio' + audioNum +
						'" preload="auto" ><source src="audio/second_music.ogg" type="audio/ogg"><source src="audio/second_music.mp3" type="audio/mpeg"></audio>'
					$("body").append(audioS);
					$('#secondAudio' + audioNum)[0].play();
					$(".second").each(function() {
						if (this.paused) {
							this.remove();
						}
					});
				} else if (X == 'x') {
					// Increment wrong hits counter
					wrongHits++;
					
					// 反之单错了执行
					s -= 10;
					if (s <= 0) {
						s = 0;
					}
					// 将当前错误的数值，赋值到HTML分数中显示
					$(".scoreNum").text(calculateAccuracy() + "%");
					// 执行一次音乐
					audioNum++;
					var audioS = '<audio class="second" id="secondAudio' + audioNum +
						'" preload="auto" ><source src="audio/no_hit.ogg" type="audio/ogg"><source src="audio/no_hit.mp3" type="audio/mpeg"></audio>'
					$("body").append(audioS);
					$('#secondAudio' + audioNum)[0].play();
					$(".second").each(function() {
						if (this.paused) {
							this.remove();
						}
					});
				}
			};

			if (y > 5) {
				clearInterval(appear0);
				setTimeout(function() {
					y = 5;
					var appear1 = setInterval(function() {
						newImg.src = 'image/' + X + y + '.png';
						y--;
						if (y < 0) {
							clearInterval(appear1);
							newImg.style.display = 'none';
							
							// Count missed targets (only for the wolf that should be hit)
							if (!wasClicked && X == 'h') {
								totalHits++; // We count misses in total attempts
							}
							
							// Update score display with current accuracy
							$(".scoreNum").text(calculateAccuracy() + "%");
							
							newImg.remove();
						}
					}, 100)
				}, stay)
			}
		}, 100);
	}, secs)
	
	// Reset accuracy and score at game start
	s = 0;
	$(".scoreNum").text("0%");
}

// Analysis button click handler
$(".analysis").on("click", function() {
    // Replace with your desired URL
    window.location.href = "https://www.sooooz.com";
});
