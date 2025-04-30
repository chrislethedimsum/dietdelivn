<?php
$meals = array(
    1 => array(
        'name' => 'Sườn xào chua ngọt',
        'image' => 'https://beptruong.edu.vn/wp-content/uploads/2021/04/suon-xao-chua-ngot.jpg',
        'nutrient' => array(
            'servingsize' => 400,
            'carbs' => 100,
            'protein' => 30,
            'fat' => 40
        ),
        'description' => 'Mon nay rat ngon'
    ),
    2 => array(
        'name' => 'Bún bò huế',
        'image' => 'https://i.ytimg.com/vi/A_o2qfaTgKs/sddefault.jpg',
        'nutrient' => array(
            'servingsize' => 600,
            'carbs' => 200,
            'protein' => 50,
            'fat' => 60
        ),
        'description' => 'Mon nay cuc ki ngon'
    ),
    3 => array(
        'name' => 'Bún cá hải phòng',
        'image' => 'https://thienhongphat.vn/images/ruou%20vang/mon%20an/bun-ca-2.png',
        'nutrient' => array(
            'servingsize' => 400,
            'carbs' => 10,
            'protein' => 20,
            'fat' => 30
        ),
        'description' => 'Mon nay cuc rat ki ngon'
    ),
    4 => array(
        'name' => 'Cánh gà kfc',
        'image' => 'https://cdn.tgdd.vn/Files/2021/01/13/1320026/cach-lam-ga-ran-kfc-bang-noi-chien-khong-dau-gion-rum-an-khong-ngay-202202231031137197.jpg',
        'nutrient' => array(
            'servingsize' => 300,
            'carbs' => 120,
            'protein' => 530,
            'fat' => 40
        ),
        'description' => 'Gà KFC VÔ ĐỊCH'
    ),
);

$week1 = array(
    'startdate' => '9/12/2024',
    2 => array(
        'Day' => 'Thứ 2',
        'meal1' => $meals[1],
        'meal2' => $meals[2]
    ),
    3 => array(
        'Day' => 'Thứ 3',
        'meal1' => $meals[3],
        'meal2' => $meals[4]
    ),
    4 => array(
        'Day' => 'Thứ 4',
        'meal1' => $meals[1],
        'meal2' => $meals[3]
    ),
    5 => array(
        'Day' => 'Thứ 5',
        'meal1' => $meals[1],
        'meal2' => $meals[4]
    ),
    6 => array(
        'Day' => 'Thứ 6',
        'meal1' => $meals[2],
        'meal2' => $meals[3]
    ),
    7 => array(
        'Day' => 'Thứ 7',
        'meal1' => $meals[2],
        'meal2' => $meals[4]
    ),
    8 => array(
        'Day' => 'Chủ nhật',
        'meal1' => $meals[1],
        'meal2' => $meals[1]
    ),
);
$defaultDay = 2;
?>