from dataclasses import dataclass
from datetime import datetime
from typing import Union, Dict
import os

@dataclass
class HoaxConfig:
    num_nodes: int = 1000 # number of nodes in the graph
    average_degree: int = 6 # average degree of the graph
    alpha: Union[float, Dict[str, float]] = 0.2 # agent's gullibility or hoax'scredibility parameter
    beta: float = 0.5 # strength of the fact-checking process
    p_v: Union[float, Dict[str, float]] = 0.05 # probability of verification
    p_f: float = 0.05 # probability of forgetting
    perc_believers: float = 0.05 # initial percentage of believers
    perc_factcheckers: float = 0.05 # initial percentage of fact-checkers
    clustered: bool = False # whether to use a clustered graph
    p_seg: float = 0.95 # probability of inter-cluster connection
    steps: int = 50 # number of simulation steps
    num_realizations: int = 50 # number of realizations for averaging results
    state_colors: Dict[str, str] = None # colors for plotting states
    dt_str = "" # datetime string for file naming
    verbose: bool = True # whether to print progress messages,
    type: str = "single" # type of the experiment: "single" realization, "many" realizations, "full" experiment to produce phase diagram

    def __post_init__(self):
        if self.state_colors is None:
            self.state_colors = {
                'S': '#cccccc',
                'B': '#377eb8',
                'FC': '#e41a1c'
            }
        if self.clustered and type(self.alpha) is dict and set(self.alpha.keys()) == {'sk', 'gu'}:
            self.p_v = {'sk': 1 - self.alpha['sk'] , 'gu': 1 - self.alpha['gu']}
        elif not self.clustered and type(self.alpha) is dict:
            raise ValueError("When 'clustered' is False, 'alpha' must be a float.")
        
        self.dt_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Create output directories
        os.makedirs('graphs', exist_ok=True)
        os.makedirs('data', exist_ok=True)
        os.makedirs('plots', exist_ok=True)
        os.makedirs('config_summaries', exist_ok=True)
        os.makedirs('animated_gifs', exist_ok=True)
        os.makedirs('phase_diagrams', exist_ok=True)

    # define a function that tests the threshold on verifying probability, 
# p_v \ge \frac{2\alpha}{1-\alpha}\cdot p_f 
    def verify_threshold(self) -> bool:
        # If the graph is clustered, we cannot apply the threshold condition
        if self.clustered:
            if self.verbose:
                print("Threshold verification is not applicable for clustered graphs.")
            return False
        
        # if not clustered, apply the threshold condition
        if self.verbose:
            print("Verifying threshold condition...")
        if self.alpha < 0 or self.alpha >= 1:
            raise ValueError("ALPHA must be in the range [0, 1).")
        if self.p_f < 0 or self.p_f >= 1:
            raise ValueError("P_F must be in the range [0, 1).")
        if self.p_v < 0 or self.p_v >= 1:
            raise ValueError("P_V must be in the range [0, 1).")
        # Check the condition
        if self.verbose:
            print(f"Checking if P_V >= (2 * ALPHA) * P_F / (1 - ALPHA)")
            print(f"P_V: {self.p_v}, ALPHA: {self.alpha}, P_F: {self.p_f}")
            print(f'(2 * ALPHA) * P_F / (1 - ALPHA): {(2 * self.alpha) * self.p_f / (1 - self.alpha)}')
        return self.p_v >= (2 * self.alpha) * self.p_f / (1 - self.alpha)
    
    def __str__ (self):
        config_str = f'''
        Hoax model initial parameters:
        Type of experiment: {self.type}, Number of realizations: {self.num_realizations}, 
        Number of nodes: {self.num_nodes}, Average degree: {self.average_degree},
        Alpha: {self.alpha}, Beta: {self.beta}, p_v: {self.p_v}, p_f: {self.p_f},
        Simulation steps: {self.steps}, Segregation parameter: {self.p_seg}, Clustered: {self.clustered},
        Percentage of believers: {self.perc_believers}, Percentage of fact-checkers: {self.perc_factcheckers},
        Believers will vanish out at equilibrium:  {str(self.verify_threshold())},
        Date time: {self.dt_str}.
        '''
        return config_str
    
    def write_to_file(self):
        # Save the configuration parameters, the counts, and the predictions of the number of believers vanishing at equilibrium in a text file
        with open(f'config_summaries/{self.dt_str}_config_summary.txt', 'w') as f:
            f.write("Hoax Model Configuration:\n")
            f.write(f"Type of experiment: {self.type}\n")
            f.write(f"Number of realizations: {self.num_realizations}\n")
            f.write(f"Number of nodes: {self.num_nodes}\n")
            f.write(f"Average degree: {self.average_degree}\n")
            f.write(f"Alpha: {self.alpha}\n")
            f.write(f"Beta: {self.beta}\n")
            f.write(f"p_v: {self.p_v}\n")
            f.write(f"p_f: {self.p_f}\n")
            f.write(f"Segregation parameter (p_seg): {self.p_seg}\n")
            f.write(f"Number of steps: {self.steps}\n")
            f.write(f"Percentage of believers: {self.perc_believers}\n")
            f.write(f"Percentage of fact-checkers: {self.perc_factcheckers}\n")
            f.write(f"Clustered: {self.clustered}\n")
            f.write(f"Date time: {self.dt_str}\n")

            f.write("\nBelievers will vanish out at equilibrium: " + str(self.verify_threshold()) + "\n")    
            f.close()
