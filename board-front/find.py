import os

def find_detail_in_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'rb') as f:  # 'rb' 모드로 파일 열기
                try:
                    content = f.read().decode('utf-8')
                except UnicodeDecodeError:  # UTF-8로 디코딩이 실패한 경우
                    try:
                        content = f.read().decode('latin-1')  # latin-1로 디코딩 시도
                    except UnicodeDecodeError:  # latin-1으로도 실패한 경우
                        print(f"Failed to decode file: {file_path}")
                        continue  # 다음 파일로 넘어감
                for line_num, line in enumerate(content.split('\n'), 1):
                    if 'detail' in line:
                        print(f'Found in file: {file_path}, line {line_num}: {line.strip()}')

# 지정된 경로에서 검색 시작
directory_to_search = 'D:\\SeaFoodWeb\\LEE\\board-front\\src'
find_detail_in_files(directory_to_search)
