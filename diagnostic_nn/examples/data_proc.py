import pandas as pd
import numpy as np

df = pd.read_excel("./dataset.xlsx")
df.head()
output_cols =  ['Patient addmited to regular ward (1=yes, 0=no)',\
                'Patient addmited to semi-intensive unit (1=yes, 0=no)',\
                 'Patient addmited to intensive care unit (1=yes, 0=no)']
input_cols = ['Lymphocytes', 'Neutrophils', 'Sodium', 'Potassium', 'Creatinine','Proteina C reativa mg/dL']
data = df[input_cols + output_cols].dropna().to_numpy(copy=True)

IN = data[:,:6]
OUT = data[:,6:]
print(np.sum(~OUT.any(1)) / len(OUT))

with open("./data/dataset", "w") as f:
    np.savetxt(f, IN)
with open("./data/datalabel", "w") as f:
    np.savetxt(f, OUT)
