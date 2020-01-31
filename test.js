const uuidv4 = require('uuid/v4');
const randomEmail = require('random-email');
const fakerator = require("fakerator");
const randomLorem   = require('random-lorem');
const uniqueRandom = require('unique-random');

//
// console.log(randomEmail({ domain: 'example.com' }))
// console.log(Math.random().toString(36).substring(2, 15))
// console.log(randomLorem({ syllables: 5 }) + '@gmail.com')

const names = [
    'Chu Thị Xuân', 'Nguyễn Thị Hồng', 'Phạm Thị Diệp', 'Ngọc Bích Trinh', 'Châu Thị Nghè', 'Phạm Ngọc Hùng', 'Chung Văn Bảy', 'Phạm Ngọc Huyền', 'Liên Thị Lý', 'Nguyễn Thị Ngọc', 'Bùi Kim Quyên', 'Võ An Phước Thiện', 'Dương Hoài Phương', 'Phan Vinh Bính', 'Võ Minh Thư', 'Phan Huỳnh Ngọc Dung', 'Nguyễn Vân Anh', 'Nguyễn Thế Vinh', 'Nguyen Thi Thanh Bích', 'Lê Minh Vương', 'Trương Gia Mẫn', 'Vương Thu Hiền', 'Châu Thị Kim Anh', 'Trần NGọc Trang', 'Cao Minh Hiền', 'Ta thị thanh tuyen', 'Võ Thị Tuyết Vân', 'Mai Khánh Vân', 'Đoàn Thị Mỹ Xuân', 'Doãn Phan Trung Hải', 'Lâm Ngọc Linh', 'Nguyễn Minh Châu'
]

const random = uniqueRandom(1, names.length);
console.log(random())

console.log(names[random()])
