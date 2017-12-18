del output.txt
for %%f in (*.json) do type "%%f" >> output.txt && echo , >> output.txt
